import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})

export class MainPageComponent {
  xmlContent: string | undefined;
  jsonContent: string | undefined;

  onXMLFileUploaded(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.xmlContent = reader.result?.toString();
    };
    reader.readAsText(file);
  }

  onJSONFileUploaded(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.jsonContent = reader.result?.toString();
    };
    reader.readAsText(file);
  }
}
