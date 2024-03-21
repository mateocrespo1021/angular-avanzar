import { NgFor, NgIf } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Publicacion } from 'app/services/models/publicaciones';
import { ComentarioService } from 'app/services/services/comentarios.service';
import { PublicacionesService } from 'app/services/services/publicaciones.service';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { ComentariosModalEditarComponent } from '../comentarios-modal-editar/comentarios-modal-editar.component';
import { MatButtonModule } from '@angular/material/button';
export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    stroke: ApexStroke;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    tooltip: ApexTooltip;
    colors: string[];
    title: ApexTitleSubtitle;
    subtitle: ApexTitleSubtitle;
};

@Component({
    selector: 'comments',
    standalone: true,
    templateUrl: './comments.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [NgApexchartsModule, MatIconModule,NgIf,MatButtonModule ,MatTabsModule, MatMenuModule,NgFor,MatTooltipModule]
})

export class CommentsComponent {
    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;
    idUser: number = 0;
    listPubli: Publicacion[] = [];
    listNumberSeries:number[]=[];
    listStringCategori:String[]=[];
    constructor(private _commitService: ComentarioService, private _publiService: PublicacionesService,private _matDialog: MatDialog) {

        this.idUser = parseInt(localStorage.getItem("idUser") ?? '0');
        this.recuperarDatos();
    }


    recuperarDatos(): void {
   
        this._publiService.informacionPublicacionCommentarios(this.idUser)
            .subscribe({

                next: (response) => {
                    this.listPubli=response;
                    this.separarDatos();
                    this.cargarGragico();

                }, error: (error) => {

                }
            });
    }


    separarDatos():void{
        this.listNumberSeries.length=0;
        this.listStringCategori.length=0;
        for(const publi of this.listPubli){
          
            this.listNumberSeries.push(parseInt(publi.tiempoTranscurrido));
            this.listStringCategori.push(publi.tituloPublicacion);
        }

        
    
    }

    cargarGragico(): void {



        this.chartOptions = {
            series: [
                {
                    data: this.listNumberSeries
                }
            ],
            chart: {
                type: "bar",
                height: 380,
                toolbar: {
                    show: false // Esto oculta los botones de descarga
                }
            },
            plotOptions: {
                bar: {
                    barHeight: "100%",
                    distributed: true,
                    horizontal: true,
                    dataLabels: {
                        position: "bottom"
                    }
                }
            },
            colors: [
                "#33b2df",
                "#546E7A",
                "#d4526e",
                "#13d8aa",
                "#A5978B",
                "#2b908f",
                "#f9a3a4",
                "#90ee7e",
                "#f48024",
                "#69d2e7",
                "#FFA500",
                "#8000ff"
            ],
            dataLabels: {
                enabled: true,
                textAnchor: "start",
                style: {
                    colors: ["#333333"]
                },
                formatter: function (val, opt) {
                    return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
                },
                offsetX: 0,
                dropShadow: {
                    enabled: false
                }
            },
            stroke: {
                width: 1,
                colors: ["#fff"]
            },
            xaxis: {
                categories: this.listStringCategori 
            },
            yaxis: {
                labels: {
                    show: false
                }
            },
            title: {
                text: "Comentarios",
                align: "center",
                floating: true,
                style: {
                    color: "#333333" // Color del título
                }
            },
            subtitle: {
                text: "Gestión y visualizaciones de los comentarios",
                align: "center",
                style: {
                    color: "#333333" // Color del título
                }
            },
            tooltip: {
                theme: "dark",
                x: {
                    show: false
                },
                y: {
                    title: {
                        formatter: function () {
                            return "";
                        }
                    }
                }
            }
        };
    }

    openComposeEditCommen(idPublicacion: number, numComent:String){
        
        if(numComent!=="0"){
            const dialogRef=this._matDialog.open(ComentariosModalEditarComponent,{
                data:{idPubli:idPublicacion},
            }) 
        }
       
    }
}
