import { Component, Input, ViewChild } from '@angular/core';
import * as xml2js from 'xml2js';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

// Interface for a patient (row in a table)
export interface PatientData {
  id: string;
  name: string;
  birthDate: string;
  allergies: string;
  chronic_diseases: string;
  surgical_history: string;
  diagnosis: string;
  treatment: string;
  eeg_date: string;
  interpretation: string;
}

@Component({
  selector: 'app-display-files',
  templateUrl: './display-files.component.html',
  styleUrls: ['./display-files.component.scss'],
})
export class DisplayFilesComponent {
  @Input() xmlContent: string | undefined;
  @Input() jsonContent: string | undefined;

  patients: any[] = [];
  displayedColumns: string[] = [
    'id',
    'name',
    'birthDate',
    'medical_history',
    'diagnosis',
    'treatment',
    'eeg_signals'
  ];
  dataSource: MatTableDataSource<PatientData> = new MatTableDataSource();
  transformedHtml = '';

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor() {}

  ngOnChanges(): void {
    if (this.xmlContent) {
      const xmlData = this.xmlContent;
      // Define XSLT file path
      const xsltPath = 'assets/pacienti.xslt';

      // Load XSLT file
      if (xsltPath) {
        const xsltProcessor = new XSLTProcessor();
        const xsltRequest = new XMLHttpRequest();
        xsltRequest.open('GET', xsltPath, true);
        xsltRequest.onreadystatechange = () => {
          if (xsltRequest.readyState === XMLHttpRequest.DONE) {
            if (xsltRequest.status === 200) {
              const xsltDocument = xsltRequest.responseXML;
              if (xsltDocument) {
                xsltProcessor.importStylesheet(xsltDocument);

                // Perform XSLT transformation
                const xmlDoc = new DOMParser().parseFromString(
                  xmlData,
                  'text/xml'
                );
                const transformedDocument = xsltProcessor.transformToDocument(
                  xmlDoc
                );
                const serializer = new XMLSerializer();
                this.transformedHtml = serializer.serializeToString(
                  transformedDocument
                );
              } else {
                console.error('Failed to load XSLT document');
              }
            } else {
              console.error('Failed to load XSLT file');
            }
          }
        };
        xsltRequest.send();
      } else {
        console.error('XSLT file path is undefined');
      }
    }

    if (this.jsonContent) {
      this.parseJSON(this.jsonContent);
    }
  }

  private parseXML(xmlString: string): void {
    xml2js.parseString(xmlString, (err: any, result: any) => {
      if (err) {
        console.error(err);
        return;
      }
      this.patients = result.pacienti.pacient.map(
        (patient: any, index: number) => ({
          id: (index + 1).toString(),
          name: `${patient.nume} ${patient.prenume}`,
          birthDate: patient.data_nastere,
          allergies: patient.istoric_medical[0].alergii,
          chronic_diseases: patient.istoric_medical[0].boli_cronice,
          surgical_history: patient.istoric_medical[0].antecedente_chirurgicale,
          diagnosis: patient.diagnostic,
          treatment: patient.tratament,
          eeg_date: patient.eeg[0].data_inregistrare,
          interpretation: patient.eeg[0].interpretare,
        })
      );
      this.dataSource.data = this.patients;
      console.log(this.dataSource.data)
    });
  }

  private parseJSON(jsonString: string): void {
    const jsonData = JSON.parse(jsonString);

    this.patients = jsonData.pacienti.map((patient: any, index: number) => ({
      id: (index + 1).toString(),
      name: `${patient.nume} ${patient.prenume}`,
      birthDate: patient.data_nastere,
      allergies: patient.istoric_medical.alergii,
      chronic_diseases: patient.istoric_medical.boli_cronice,
      surgical_history: patient.istoric_medical.antecedente_chirurgicale,
      diagnosis: patient.diagnostic,
      treatment: patient.tratament,
      eeg_date: patient.eeg.data_inregistrare,
      interpretation: patient.eeg.interpretare,
    }));
    this.dataSource.data = this.patients;
  }

  ngAfterViewInit(): void {
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    } else {
      console.log('MatSort is not initialized or not available.');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
