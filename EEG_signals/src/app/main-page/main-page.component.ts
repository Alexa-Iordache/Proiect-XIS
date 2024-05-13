import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {

  // Variables for fetched content from XML and JSON files
  xmlContent: string | undefined;
  jsonContent: string | undefined;

  // Method to upload a XML file and fetch its data in order to handle the info
  onXMLFileUploaded(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.xmlContent = reader.result?.toString();
    };
    reader.readAsText(file);
  }

  // Method to upload a JSON file and fetch its data in order to handle the info
  onJSONFileUploaded(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.jsonContent = reader.result?.toString();
    };
    reader.readAsText(file);
  }
}
