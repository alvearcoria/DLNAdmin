import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import * as _ from 'lodash';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {
  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this._saveAsExcelFile(excelBuffer, excelFileName);
  }

  csv_exportAsExcelFile(csv: any, excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(csv);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this._saveAsExcelFile(excelBuffer, excelFileName);
  }

  exportDataAsExcelFile(dataHTML: any, excelFileName: string): void {
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(dataHTML)

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'SheetJS.xlsx');
  }

  createWorkbookFromJson(json) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return workbook
  }

  _saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  public processFileToJson(object, file): Observable<any> {
    let reader = new FileReader();
    let _this = this;

    return Observable.create(observer => {
      reader.onload = function (e) {
        let data = e.target['result'];
        let workbook = XLSX.read(data, {
          type: 'binary'
        });
        object.sheets = _this.parseWorksheet(workbook, true, true);
        observer.next(object);
        observer.complete();
      }
      reader.readAsBinaryString(file);
    });
  }


  parseWorksheet(workbook, readCells, toJSON) {
    if (toJSON === true) {
      return this.to_json(workbook);
    }
    let sheets = {};
    _.forEachRight(workbook.SheetNames, function (sheetName) {
      let sheet = workbook.Sheets[sheetName];
      sheets[sheetName] = this.parseSheet(sheet, readCells);
    });
    return sheets;
  }

  parseSheet(sheet, readCells) {
    let range = XLSX.utils.decode_range(sheet['!ref']);
    let sheetData = [];

    if (readCells === true) {
      _.forEachRight(_.range(range.s.r, range.e.r + 1), function (row) {
        let rowData = [];
        _.forEachRight(_.range(range.s.c, range.e.c + 1), function (column) {
          let cellIndex = XLSX.utils.encode_cell({
            'c': column,
            'r': row
          });
          let cell = sheet[cellIndex];
          rowData[column] = cell ? cell.v : undefined;
        });
        sheetData[row] = rowData;
      });
    }

    return {
      'sheet': sheetData,
      'name': sheet.name,
      'col_size': range.e.c + 1,
      'row_size': range.e.r + 1
    }
  }

  to_json(workbook) {
    let result = {};
    workbook.SheetNames.forEach(function (sheetName) {
      let roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      if (roa.length > 0) {
        result[sheetName] = roa;
      }
    });
    return result;
  }

  storethis(somejson) {
    console.log(JSON.parse(somejson));
  }
}
