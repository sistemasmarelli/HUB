import { Component, ElementRef, HostListener, inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { PoTableColumn,
  PoModalComponent,
  PoModalAction,
  PoTableLiterals,
  PoLookupColumn,
  PoLookupLiterals,
  PoDialogService,
  PoPageAction,
  PoNotificationService,
  PoModule,
  PoDecimalComponent,
  PoTableAction,
  PoChartType, PoChartOptions, PoChartSerie} from '@po-ui/ng-components';
import { PendProdHttpService } from './pendProd-http.service';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { PoPageDynamicSearchLiterals, PoTemplatesModule } from '@po-ui/ng-templates';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { map } from 'rxjs';

type Filtro = {
  nrLinha: string;
};

@Component({
  selector: 'app-pendProd',
  templateUrl: './pendProd.component.html',
  styleUrls: ['./pendProd.component.css'],
  standalone: true,
  imports: [PoModule, PoTemplatesModule, FormsModule, CommonModule ],  
  providers: [] //VerificaFichaSemVinculoService] 
})

export class PendProdComponent implements OnInit {

  public estabelecimentosLista: Array<any> = [];
  public estabelecimentoSelecionado: string;
  public emitenteSelecionado: string;
  public nomeAbrevEmitenteSelecionado: string;
  public URL_BASE: string = environment.apiProgress;
  public dt_emissao: Date = new Date(); 
  public dt_emissao_f: Date = new Date(); 
  public dt_vencimento: Date = new Date();
  public dt_vencimento_f: Date = new Date();
  public carregandoPendProd: boolean;
  public items: any[];
  public filterKeys: any[];
  public numeroPaginaPesquisaPrincipal: number = 0;
  public searchFilters: string = '';
  public disableShowMoreButton: boolean = false;
  public total1: number = 0;
  public total2: number = 0;
  public containerHeight: number = 1000;
  public tableHeight: number = 800;
  public tableHeightGraph: number = 980;
  public tableHeightGraphInt: number = 480;
  public targetTop : number = 0;
  public scrollStep: number = 10;
  public titleBase: string = "Marelli - Pendências de Produção";
  public title: string = this.titleBase;
  public dataHoraExec: string = '';

  private poNotification = inject(PoNotificationService);
  private tableObserver?: ResizeObserver;

  
  public filtro: Filtro = {nrLinha: ''};

  // Elemento que realmente rola (o container interno de linhas da po-table)
  private scrollEl: HTMLElement | null = null;

  // Controle do auto-scroll
  private intervalId: any = null;  
  public  isPaused: boolean = true;

  // Controle de carga de dados
  private intervalCarga: any = null;  

  readonly literals: PoPageDynamicSearchLiterals = {
    quickSearchLabel: 'Valor pesquisado:',
    searchPlaceholder: 'Pesquisar Nr Linha'
  };

  filtered($event: any[]) {
    throw new Error('Method not implemented.');
  }

  @ViewChild('tableScroll', { read: ElementRef }) tableScrollRef!: ElementRef;

  colunasPendProd: Array<PoTableColumn> = [
    { property: 'nrCarga'        ,    label: 'Nr. Carga' },
    { property: 'itCodigo'       ,    label: 'Item' },
    { property: 'descItem'       ,    label: 'Descrição' , width: '15%'},
    { property: 'qtPecas'        ,    label: 'Qt Peças' },
    { property: 'nrPedcli'       ,    label: 'Ped Cli' },
    { property: 'nomeAbrev'      ,    label: 'Cliente' },
    { property: 'dtFimProd'      ,    label: 'Dt Fim Prod' , type: 'date'}
  ];

  dadosPendProd: Array<Record<string, unknown>> = [];
  dadosChart1  : Array<PoChartSerie> = [];
  dadosChart2  : Array<PoChartSerie> = [];
  configuracaoPendProd: PoTableLiterals = {
    loadMoreData: 'Buscar mais dados',
    loadingData: 'Buscando Pendências disponíveis',
    noData: 'Nenhuma Pendência Encontrado'
  };
  
  constructor(
    private pendProdHttpService: PendProdHttpService,
    private poDialog: PoDialogService,
    private routeActivated: ActivatedRoute,
    private http: HttpClient, 
    private sanitizer: DomSanitizer,
    private el: ElementRef, 
    private ngZone: NgZone
  ) {}

  private hasScrollable(el: HTMLElement): boolean {
    const style = window.getComputedStyle(el);
    const overflowY = style.overflowY;
    const overflow = style.overflow;
    return (
      overflowY === 'auto' ||
      overflowY === 'scroll' ||
      overflow === 'auto' ||
      overflow === 'scroll'
    );
  }

  private captureScrollableElement(): void {
    if (!this.tableScrollRef) {
      return;
    }

    const host: HTMLElement = this.tableScrollRef.nativeElement as HTMLElement;

    // Tentativas por seletores comuns do PO UI .
    // Mantém ordem da mais específica para menos:
    const candidates = [
      '.po-table-content',        // corpo rolável clássico
      '.po-table-container',      // contêiner com overflow
      '.po-table-wrapper',        // em algumas versões
      '.po-table'                 // último recurso
    ];

    for (const selector of candidates) {
      const el = host.querySelector(selector) as HTMLElement | null;
      if (el && this.hasScrollable(el)) {
        this.scrollEl = el;
        break;
      }
    }

      // Fallback: vasculha filho com overflow auto/scroll
    if (!this.scrollEl) {
      const walker = document.createTreeWalker(host, NodeFilter.SHOW_ELEMENT);
      let node: Element | null = walker.currentNode as Element;
      // percorre procurando overflow auto/scroll
      while ((node = walker.nextNode() as Element | null)) {
        const style = window.getComputedStyle(node);
        const overflowY = style.overflowY;
        const overflow = style.overflow;
        if (
          (overflowY === 'auto' || overflowY === 'scroll') ||
          (overflow === 'auto' || overflow === 'scroll')
        ) {
          this.scrollEl = node as HTMLElement;
          break;
        }
      }
    }
  }



   togglePause(): void {
    this.stopAutoScroll();
    
    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      this.startAutoScroll();
    } 
   }

   ngAfterViewInit(): void {
    // Calcula alturas após a view estar pronta
    setTimeout(() => {
      this.recalcContainerHeight();

      this.captureScrollableElement();
      this.startAutoScroll();


      // Recarrega os dados a cada 5 minutos (300000 segundos)
      this.intervalCarga = setInterval(() => {
        this.getPendProd(this.filtro);}, 
        300000);
        
      });


  }

  private startAutoScroll(): void {
    if (!this.scrollEl) {
      return;
    }

    // Alterna a cada 20 segundos
    this.intervalId = setInterval(() => {
      this.scrollToEdge();
      }, 200);
  }

  private scrollToEdge(): void {
      
    if (!this.scrollEl) return;

    this.targetTop += this.scrollStep;
    if (this.targetTop + this.scrollStep >= this.scrollEl.scrollHeight || this.targetTop + this.scrollStep <= 0) {
      this.scrollStep = -this.scrollStep;
    }

    this.scrollEl.scrollTo({
      top: this.targetTop,
      behavior: 'smooth'
    });


  }
    



  @HostListener('window:resize')
  onWindowResize(): void {
    this.recalcContainerHeight();
  }

  private recalcContainerHeight(): void {
    // Seleciona o po-container real no DOM
    const containerEl = this.el.nativeElement.querySelector('po-container');

    if (!containerEl) {
      return;
    }

    const rect = containerEl.getBoundingClientRect();
    const viewportH = window.innerHeight;

    // Margem inferior da viewport
    const bottomPadding = 16;

    // Altura disponível da viewport a partir do topo do container
    const available = viewportH - rect.top - bottomPadding;

    // Evita valores negativos e define um mínimo
    this.containerHeight = Math.max(200, Math.floor(available));

    // Ajusta tanho dos demais componentes
    this.tableHeight= this.containerHeight - 175;
    this.tableHeightGraph = this.containerHeight - 20;
    this.tableHeightGraphInt = this.tableHeightGraph / 2;
    
  }

  ngOnDestroy(): void {
    this.tableObserver?.disconnect();
    this.stopAutoScroll();
  }

  private stopAutoScroll(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }



  
  
  ngOnInit() {
    //this.getPendProd();
  }

     
  
  getPendProd(filter) {

    this.filtro = filter;

    this.carregandoPendProd = true;
    this.searchFilters = '';
    this.numeroPaginaPesquisaPrincipal = 1;

    let dataExec = new Date();
    this.dataHoraExec = `${dataExec.getDate().toString().padStart(2, '0')}/${(dataExec.getMonth() + 1).toString().padStart(2, '0')}/${dataExec.getFullYear()} ${dataExec.getHours().toString().padStart(2, '0')}:${dataExec.getMinutes().toString().padStart(2, '0')}`;

    //if  (this.dt_emissao != null && this.dt_vencimento != null) {
        this.pendProdHttpService.buscaPendProd(filter).subscribe(
          
        (res) => {

          this.dadosPendProd = [];

          if (res.items[0].coderro != undefined) {
              this.poNotification.error(res.items[0].coderro + ': ' + res.items[0].mensagem);
          } else {

              //this.dadosPendProd = res.items[0].items;
              this.dadosPendProd = Array.isArray(res?.items?.[0]?.items)
                  ? res.items[0].items
                  : [];

              const emAtraso  = res.items[0].chart1[0].emAtraso;
              const emDia     = res.items[0].chart1[0].emDia;
              const adiantado = res.items[0].chart1[0].adiantado;

              this.total1     = emAtraso + emDia + adiantado;

              const labelEmAtraso  = `${(emAtraso  / this.total1 * 100).toFixed(2)}` + '% Em Atraso: ' + `${emAtraso}`  + ' peças';
              const labelEmDia     = `${(emDia     / this.total1 * 100).toFixed(2)}` + '% Em Dia: '    + `${emDia}`     + ' peças';
              const labelAdiantado = `${(adiantado / this.total1 * 100).toFixed(2)}` + '% Adiantado: ' + `${adiantado}` + ' peças';

              this.dadosChart1 = [
                  { label: labelEmAtraso,  data: emAtraso,  color:'color-07' },  // Vermelho
                  { label: labelEmDia,     data: emDia,     color:'color-02' },  // Azul
                  { label: labelAdiantado, data: adiantado, color:'color-10' }   // Verde
              ]

              const atendidos = res.items[0].chart2[0].atendidos;
              const pendentes = res.items[0].chart2[0].pendentes;

              this.total2     = atendidos + pendentes;

              const labelAtendidos = `${(atendidos / this.total2 * 100).toFixed(2)}` + '% Atendido: ' + `${atendidos}`  + ' peças';
              const labelPendentes = `${(pendentes / this.total2 * 100).toFixed(2)}` + '% Falta: '    + `${pendentes}`  + ' peças';

              this.dadosChart2 = [
                  { label: labelPendentes, data: pendentes, color:'color-07' },  // Vermelho
                  { label: labelAtendidos, data: atendidos, color:'color-10' }   // Verde
              ]
          }
          
          this.title = this.titleBase + ' - Linha: ' + filter;
          this.recalcContainerHeight();

          this.carregandoPendProd = false;

        },
        (error) => {
            this.dadosPendProd = [];
            this.carregandoPendProd = false;
            this.poNotification.error(error);
        }
      );

      this.carregandoPendProd = false;

  }
  
}

  