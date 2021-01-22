import { Injectable } from '@nestjs/common';
import { InjectBrowser } from 'nest-puppeteer';
import type { Browser } from 'puppeteer';

import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportService {
  constructor(@InjectBrowser() private readonly browser: Browser) {}

  async create(
    createReportDto: CreateReportDto,
    statistics: 'byDay' | 'weekly',
  ) {
    const { startDate, endDate, shopIds } = createReportDto;
    // const version = await this.browser.version();
    // const page = await this.browser.newPage();

    console.log('statistics :::::: ', statistics);
    console.log('startDate :::::: ', startDate);
    console.log('endDate :::::: ', endDate);
    console.log('shopIds :::::: ', shopIds);

    // await page.setViewport({
    //   width: 1920,
    //   height: 1080,
    // });
    // await page.goto(`http://localhost:3000/statistics/${statistics}`);
    // await page.waitForSelector('[name=email]');

    // await page.$eval(
    //   '[name=email]',
    //   (el: HTMLInputElement) => (el.value = 'admin@admin.com'),
    // );
    // await page.$eval(
    //   '[name=password]',
    //   (el: HTMLInputElement) => (el.value = '1q2w3e4r'),
    // );
    // const loginBtn = await page.$('[name=login]');
    // console.log('loginBtn :::: ', loginBtn);
    // loginBtn.click();

    // await page.waitForSelector('[name=logout]');

    // await page.screenshot({
    //   path: 'test.png',
    // });

    //name=email
    //name=password

    // page.close();
    // return { version };
    return null;
  }
}
