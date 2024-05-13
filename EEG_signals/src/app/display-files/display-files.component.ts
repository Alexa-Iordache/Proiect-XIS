import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
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
  img: string;
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

  // Paginator for JSON data table
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  // Fetch data from files
  ngOnChanges(): void {
    if (this.xmlContent) {
      this.transformXmlToHtml(this.xmlContent);
    }

    if (this.jsonContent) {
      this.parseJSON(this.jsonContent);
    }
  }

  // Fetch data from JSON file
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
      img: patient.eeg.imagine_eeg
    }));
    this.dataSource.data = this.patients;
    console.log(this.dataSource.data);
  }

  // Fetch data from XML file and transform it in HTML using XSLT file
  private transformXmlToHtml(xmlString: string): void {
    const xsltPath = 'assets/pacienti.xslt';

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
                xmlString,
                'text/xml'
              );
              const transformedDocument =
                xsltProcessor.transformToDocument(xmlDoc);
              const serializer = new XMLSerializer();
              this.transformedHtml =
                serializer.serializeToString(transformedDocument);
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

  // Apply paginator for JSON data table
  ngAfterViewInit(): void {
    if (this.paginator) this.dataSource.paginator = this.paginator;
  }

  // Apply filter for JSON data table
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Apply filter for XML data table
  applyFilterForXML(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    const tableRows = document.querySelectorAll('tr');
    tableRows.forEach((row, index) => {
      // Display the table header
      if (index === 0 || index === 1) return;

      const textContent = row.textContent || row.innerText;
      row.style.display = textContent.toLowerCase().includes(filterValue)
        ? ''
        : 'none';
    });
  }
}
