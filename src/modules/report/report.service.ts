import { Injectable } from '@nestjs/common';
import { mkdirSync, writeFileSync } from 'fs';
import { Workbook } from 'excel4node';

import { mmt } from '@/moment';
import { StatisticsService } from '../statistics/statistics.service';

@Injectable()
export class ReportService {
  constructor(private readonly statisticsService: StatisticsService) {}

  async uploadImages(images: any[]) {
    console.log('images : ', images);
    const idDev = process.env.NODE_ENV === 'development';
    const date = mmt().format('YYYYMMDD_HHmmss');

    if (!idDev) {
      mkdirSync(`temp/${date}`, { recursive: true });

      for (let i = 0, len = images.length; i < len; i += 1) {
        await writeFileSync(`temp/${date}/${i}.png`, images[i].buffer);
      }
      console.log('created');
    }
    return date;
  }

  async createWeeklyReport(params: {
    ids: number[];
    weeks: DateRange[];
    path: string;
  }) {
    const { ids, weeks, path } = params;

    return null;
  }

  async createDayByReport(params: {
    ids: number[];
    dateList: string[];
    path: string;
  }) {
    console.log('process.env.NODE_ENV : ', process.env.NODE_ENV);
    const idDev = process.env.NODE_ENV === 'development';
    const { ids, dateList, path } = params;
    const statisticsData = await this.statisticsService.getByDay({
      ids,
      dateList,
    });

    const { byDayMileage, byDayCount } = statisticsData;

    // console.log('byDayMileage : ', byDayMileage);
    // console.log('byDayCount : ', byDayCount);

    const wb = new Workbook({
      workbookView: {
        ctiveTab: 1, // Specifies an unsignedInt that contains the index to the active sheet in this book view.
        autoFilterDateGrouping: true, // Specifies a boolean value that indicates whether to group dates when presenting the user with filtering options in the user interface.
        firstSheet: 1, // Specifies the index to the first sheet in this book view.
        minimized: false, // Specifies a boolean value that indicates whether the workbook window is minimized.
        showHorizontalScroll: true, // Specifies a boolean value that indicates whether to display the horizontal scroll bar in the user interface.
        showSheetTabs: true, // Specifies a boolean value that indicates whether to display the sheet tabs in the user interface.
        showVerticalScroll: true, // Specifies a boolean value that indicates whether to display the vertical scroll bar.
        tabRatio: 600, // Specifies ratio between the workbook tabs bar and the horizontal scroll bar.
        visibility: 'visible', // Specifies visible state of the workbook window. ('hidden', 'veryHidden', 'visible') (§18.18.89)
        windowHeight: 17620, // Specifies the height of the workbook window. The unit of measurement for this value is twips.
        windowWidth: 28800, // Specifies the width of the workbook window. The unit of measurement for this value is twips..
        xWindow: 0, // Specifies the X coordinate for the upper left corner of the workbook window. The unit of measurement for this value is twips.
        yWindow: 440, // Specifies the Y coordinate for the upper left corner of the workbook window. The unit of measurement for this value is twips.
      },
    });
    const ws = wb.addWorksheet('서빙거리');
    const ws2 = wb.addWorksheet('서빙횟수');

    const style = wb.createStyle({
      font: {
        color: '#333333',
        size: 12,
      },
    });

    if (!idDev) {
      ws.addImage({
        path: `temp/${path}/0.png`,
        type: 'picture',
        position: {
          type: 'absoluteAnchor',
          x: '1in',
          y: '2in',
        },
      });
    }

    for (let i = 1, len = 7; i <= len; i += 1) {
      ws.cell(1, 1 + i)
        .string(byDayMileage.labels[i - 1])
        .style(style);
    }

    byDayMileage.datasets.forEach((item, i) => {
      const { data, label, shopName } = item;
      console.log('item', item);
      ws.cell(i + 2, 1)
        .string(label)
        .style(style);

      data.forEach((data, index) => {
        ws.cell(i + 2, index + 2)
          .number(data)
          .style(style);
      });
    });

    // Set value of cell A1 to 100 as a number type styled with paramaters of style
    // ws.cell(1, 1).number(100).style(style);

    // Set value of cell B1 to 200 as a number type styled with paramaters of style
    // ws.cell(1, 2).number(200).style(style);

    // Set value of cell C1 to a formula styled with paramaters of style
    // ws.cell(1, 3).formula('A1 + B1').style(style);

    // Set value of cell A2 to 'string' styled with paramaters of style
    // ws.cell(2, 1).string('string').style(style);

    // Set value of cell A3 to true as a boolean type styled with paramaters of style but with an adjustment to the font size.
    // ws.cell(3, 1)
    //   .bool(true)
    //   .style(style)
    //   .style({ font: { size: 14 } });

    if (idDev) {
      wb.write('test.xlsx');
    } else {
      const xlsxPath = `temp/${path}/${dateList[0]}~${
        dateList[dateList.length - 1]
      }-DayBy.xlsx`;
      const prms = new Promise((res, rej) => {
        wb.write(xlsxPath, (err) => {
          if (err) {
            console.error(err);
            rej(err);
          } else {
            res(xlsxPath);
          }
        });
      });

      return prms;
    }
  }
}
