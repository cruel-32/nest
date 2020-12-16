select * from pudu_delivery where DATE_FORMAT(create_time, '%Y-%m-%d') = '2020-11-30'
select * from pudu_delivery where FROM_UNIXTIME(timestamp, '%Y-%m-%d') = '2020-11-30'

 SELECT DATE_FORMAT(DATE_SUB(`create_time`, INTERVAL (DAYOFWEEK(`create_time`)-1) DAY), '%Y/%m/%d') as start,
       DATE_FORMAT(DATE_SUB(`create_time`, INTERVAL (DAYOFWEEK(`create_time`)-7) DAY), '%Y/%m/%d') as end,
       DATE_FORMAT(`create_time`, '%Y%U') AS `date`,
       sum(`mileage`)
  FROM pudu_delivery
 GROUP BY shop_id 