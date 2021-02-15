import { Injectable } from '@nestjs/common';
import {
  mkdirSync,
  writeFile,
  writeFileSync,
  readFileSync,
  readFile,
} from 'fs';
import { join } from 'path';
import { Workbook } from 'excel4node';
import { google } from 'googleapis';
import { createInterface } from 'readline';

import {
  exceljs,
  XLSXChart,
  excel4node,
  nodeXlsx,
  xlsx,
} from '@/excel-library';
import { mmt } from '@/moment';
import { StatisticsService } from '../statistics/statistics.service';

@Injectable()
export class ReportService {
  constructor(private readonly statisticsService: StatisticsService) {}

  SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
  TOKEN_PATH = 'token.json';

  async uploadImages(images: any[]) {
    const date = mmt().format('YYYYMMDD_HHmmss');
    const imagePath = `${join(__dirname, '../../../')}temp/${date}`;
    console.log('imagePath :::: ', imagePath);

    mkdirSync(`${imagePath}`, {
      recursive: true,
    });

    for (let i = 0, len = images.length; i < len; i += 1) {
      await writeFileSync(`${imagePath}/${i}.png`, images[i].buffer);
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
    const { ids, dateList, path } = params;
    const tempPath = `${join(__dirname, '../../../')}temp/${path}`;
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

    ws.addImage({
      path: `${tempPath}/0.png`,
      type: 'picture',
      position: {
        type: 'absoluteAnchor',
        x: '1in',
        y: '2in',
      },
    });

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

    const xlsxPath = `${tempPath}/${dateList[0]}~${
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

  async getWeeklyReport(params: { ids: number[]; weeks: DateRange[] }) {
    const { ids, weeks } = params;

    return null;
  }

  async getDayByReport(params: { ids: number[]; dateList: string[] }) {
    const { ids, dateList } = params;
    const statisticsData = await this.statisticsService.getByDay({
      ids,
      dateList,
    });

    const { byDayMileage, byDayCount } = statisticsData;

    console.log('byDayMileage : ', byDayMileage);
    console.log('byDayCount : ', byDayCount);

    // const workbook = read(byDayMileage, { type: 'buffer' });
    // const exampleWorkbook = xlsx.readFile(
    //   join(__dirname, '../../../', 'example.xlsx'),
    // );
    // const worksheet = workbook.Sheets['Sheet1'];
    // console.log('worksheet : ', worksheet);

    const { datasets, labels } = byDayMileage;

    labels.unshift('상점명');

    const dataSheet1 = [
      labels,
      [true, false, null, 'sheetjs'],
      ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'],
      ['baz', null, 'qux'],
    ];

    const dataSheet2 = [
      [4, 5, 6],
      [7, 8, 9, 10],
      [11, 12, 13, 14],
      ['baz', null, 'qux'],
    ];
    const range = { s: { c: 0, r: 0 }, e: { c: 0, r: 3 } }; // A1:A4
    const sheetOptions = { '!merges': [range] };

    const buffer = nodeXlsx.build([
      { name: 'myFirstSheet', data: dataSheet1 },
      { name: 'mySecondSheet', data: dataSheet2, options: sheetOptions },
    ]); // Returns a buffer
    writeFileSync('test.xlsx', buffer);

    return buffer;
  }

  async getReport(params: { ids: number[]; dateList: string[] }) {
    const { ids, dateList } = params;
    const {
      statisticData,
      shopNames,
    } = await this.statisticsService.getRawData({
      ids,
      startDate: dateList[0],
      endDate: dateList[dateList.length - 1],
    });

    //api_key : AIzaSyAMIsX_ud8IDsR7WapFQfv8V2wJin7bKFY

    readFile('credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Sheets API.
      this.authorize(JSON.parse(content.toString()), this.listMajors);
    });

    return null;
  }

  authorize(credentials, callback) {
    const {
      client_id,
      project_id,
      auth_uri,
      token_uri,
      auth_provider_x509_cert_url,
      client_secret,
      redirect_uris,
    } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0],
    );

    console.log('oAuth2Client ::::: ', oAuth2Client);

    // Check if we have previously stored a token.
    readFile(this.TOKEN_PATH, (err, token) => {
      if (err) {
        console.error('err ::::: ', err);
        return this.getNewToken(oAuth2Client, callback);
      }

      oAuth2Client.setCredentials(JSON.parse(token.toString()));
      callback(oAuth2Client);
    });
  }

  // authorize(credentials, callback) {
  //   const { client_secret, client_id, redirect_uris } = credentials.installed;
  //   const oAuth2Client = new google.auth.OAuth2(
  //     client_id,
  //     client_secret,
  //     redirect_uris[0],
  //   );

  //   // Check if we have previously stored a token.
  //   readFile(this.TOKEN_PATH, (err, token) => {
  //     if (err) return this.getNewToken(oAuth2Client, callback);
  //     oAuth2Client.setCredentials(JSON.parse(token.toString()));
  //     callback(oAuth2Client);
  //   });
  // }

  getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      console.log('code ::::: ', code);
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err)
          return console.error(
            'Error while trying to retrieve access token',
            err,
          );
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        writeFile(this.TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', this.TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }

  listMajors(auth) {
    const sheets = google.sheets({ version: 'v4', auth });
    sheets.spreadsheets.values.get(
      {
        spreadsheetId:
          '1Wd30_QUWH61tZ3s8jTFw_R9msvV4_Wz1IUR0agDyphg/edit#gid=0',
        range: 'Class Data!A2:E',
      },
      (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        if (rows.length) {
          console.log('Name, Major:');
          // Print columns A and E, which correspond to indices 0 and 4.
          rows.map((row) => {
            console.log(`${row[0]}, ${row[4]}`);
          });
        } else {
          console.log('No data found.');
        }
      },
    );
  }

  // async getReport(params: { ids: number[]; dateList: string[] }) {
  //   const { ids, dateList } = params;
  //   const {
  //     statisticData,
  //     shopNames,
  //   } = await this.statisticsService.getRawData({
  //     ids,
  //     startDate: dateList[0],
  //     endDate: dateList[dateList.length - 1],
  //   });

  //   const shopIds = Object.keys(shopNames);
  //   const options = {
  //     '!cols': [{ wch: 20 }, ...dateList.map(() => ({ wch: 12 }))],
  //   };

  //   const result = shopIds.reduce(
  //     (sheets, id, i) => {
  //       dateList.forEach((Dday) => {
  //         const statistic = statisticData.find(({ date }) => date === Dday) || {
  //           date: Dday,
  //           puduCounts: {},
  //           puduMileages: {},
  //         };
  //         const mileageSheet: string[][] | number[][] = sheets[0];
  //         const countSheet: string[][] | number[][] = sheets[1];

  //         const { puduCounts, puduMileages } = statistic;

  //         if (!Array.isArray(mileageSheet[i + 1])) {
  //           mileageSheet[i + 1] = [`${shopNames[id]} (${id})`];
  //         }

  //         const mileage = puduMileages?.[id]?.toFixed(2) || '0.00';

  //         mileageSheet[i + 1].push(mileage);

  //         if (!Array.isArray(countSheet[i + 1])) {
  //           countSheet[i + 1] = [`${shopNames[id]} (${id})`];
  //         }

  //         const count = puduCounts?.[id] || 0;

  //         countSheet[i + 1].push(count);
  //       });

  //       return sheets;
  //     },
  //     [[['상점명', ...dateList]], [['상점명', ...dateList]]],
  //   );

  //   const test = xlsx.writeFile(
  //     {
  //       SheetNames: ['서빙거리', '서빙횟수', '서빙거리 차트'],
  //       Sheets: {
  //         서빙거리: {
  //           '!cols': [
  //             {
  //               hidden: false,
  //               wch: 10,
  //             },
  //             {
  //               hidden: false,
  //               wch: 15,
  //             },
  //             {
  //               hidden: false,
  //               wch: 20,
  //             },
  //           ],
  //         },
  //       },
  //     },
  //     'custom.xlsx',
  //     {},
  //   );

  //   // const buffer = nodeXlsx.build(
  //   //   [
  //   //     { name: '서빙거리', data: result[0] },
  //   //     { name: '서빙횟수', data: result[1] },
  //   //   ],
  //   //   options,
  //   // );
  //   // writeFileSync('test.xlsx', buffer);

  //   //차트 시작
  //   // const xlsxChart = new XLSXChart();
  //   // const data = ids.reduce((datasets, id) => {
  //   //   datasets[shopNames[id]] = dateList.reduce((dateObj, date) => {
  //   //     dateObj[date] =
  //   //       statisticData.find((statistic) => statistic.date === date)
  //   //         ?.puduMileages?.[id] || 0;

  //   //     return dateObj;
  //   //   }, {});

  //   //   return datasets;
  //   // }, {});

  //   // const opts = {
  //   //   file: 'chart.xlsx',
  //   //   chart: 'line',
  //   //   titles: ids.map((id) => shopNames[id]),
  //   //   fields: dateList.map((date) => date),
  //   //   chartTitle: '차트',
  //   //   data,
  //   // };

  //   // xlsxChart.writeFile(opts, function (err) {
  //   //   console.log('File: ', opts.file);
  //   // });
  //   //차트 끝

  //   // const workSheetsFromBuffer = xlsx.parse(readFileSync(`chart.xlsx`));

  //   // const readingBuf = xlsx.build(workSheetsFromBuffer);
  //   // writeFileSync('test.xlsx', readingBuf);

  //   const workbook = new exceljs.Workbook();

  //   workbook.xlsx.readFile('chart.xlsx').then(function () {
  //     return workbook.xlsx.writeFile('new-chart.xlsx');
  //   });

  //   return null;
  // }
}
