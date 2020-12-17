select * from pudu_delivery where DATE_FORMAT(create_time, '%Y-%m-%d') = '2020-11-30'
select * from pudu_delivery where FROM_UNIXTIME(timestamp, '%Y-%m-%d') = '2020-11-30'

SELECT DATE_ADD(NOW(), INTERVAL 1 DAY);
 
SELECT
SHOP_ID, SHOP_NAME
, SUM(CASE WHEN DATE_FORMAT(create_time, '%Y-%m-%d') BETWEEN '2020-11-01' AND '2020-11-07' THEN mileage END) `11월 첫째주`
, SUM(CASE WHEN DATE_FORMAT(create_time, '%Y-%m-%d') BETWEEN '2020-11-08' AND '2020-11-14' THEN mileage END) `11월 둘째주`
, SUM(CASE WHEN DATE_FORMAT(create_time, '%Y-%m-%d') BETWEEN '2020-11-15' AND '2020-11-21' THEN mileage END) `11월 셋째주`
, SUM(CASE WHEN DATE_FORMAT(create_time, '%Y-%m-%d') BETWEEN '2020-11-22' AND '2020-11-28' THEN mileage END) `11월 넷째주`
, SUM(CASE WHEN DATE_FORMAT(create_time, '%Y-%m-%d') BETWEEN '2020-11-29' AND '2020-11-30' THEN mileage END) `11월 다섯째주`
FROM pudu_delivery 
WHERE DATE_FORMAT(create_time, '%Y-%m-%d') BETWEEN '2020-11-01' AND '2020-11-30' 
GROUP BY SHOP_ID;