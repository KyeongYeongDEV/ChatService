import { Application, json, urlencoded } from "express";

import router from '../api/index.api';
import errorMiddleware from "../api/middlewares/error.middleware";
import PassportConfig from "../configs/passport.config";

import cors from "cors";
import path from "path";
import Container from "typedi";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import Redis from "ioredis";
import RedisStore from "connect-redis";
import axios from "axios";
const redisClient = new Redis();

import dotenv from "dotenv";

dotenv.config();

export default async ({ app }: { app: Application }) => {
    app.use(cors((req, callback) => {
        console.log(`CORS enabled for: ${req.method} ${req.url}`);
        callback(null, { origin: true });
    }));
    app.use(json());
    app.use(urlencoded({ extended: false }));
    app.use('/api', router());
    app.use(session({
        store : new RedisStore({ client : redisClient}),
        resave : false,
        saveUninitialized : false,
        secret : process.env.COOKIE_SECRET || 'secret',
        cookie : {
            httpOnly : true,
            secure : false,
            sameSite : 'strict', //외부사이트 요청에 포함되지 않도록 설정
        }
    }));

    app.use(cookieParser());

    const passportConfig = Container.get(PassportConfig);
    passportConfig.initialize();
    
    app.use(passport.initialize());
    app.use(passport.session());

    const apiEndPoint = 'http://api.data.go.kr/openapi/tn_pubr_public_nutri_food_info_api?';


    async function fetchFoodData() {
        try {
            var queryParams = '?' + encodeURIComponent('serviceKey') + '=' + process.env.API_DECODING_KEY; /* Service Key*/
            queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
            queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('100'); /* */
            queryParams += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('json'); /* */
            queryParams += '&' + encodeURIComponent('foodNm') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('foodNm') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('dataCd') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('typeNm') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('foodOriginCd') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('foodOriginNm') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('foodLv3Cd') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('foodLv3Nm') + '=' + encodeURIComponent(''); /* */ 
            queryParams += '&' + encodeURIComponent('foodLv4Cd') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('foodLv4Nm') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('foodLv5Cd') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('foodLv5Nm') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('foodLv6Cd') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('foodLv6Nm') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('foodLv7Cd') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('foodLv7Nm') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('nutConSrtrQua') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('enerc') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('water') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('prot') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('fatce') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('ash') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('chocdf') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('sugar') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('fibtg') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('ca') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('fe') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('p') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('k') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('nat') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('vitaRae') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('retol') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('cartb') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('thia') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('ribf') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('nia') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('vitc') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('vitd') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('chole') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('fasat') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('fatrn') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('srcCd') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('srcNm') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('foodSize') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('restNm') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('dataProdCd') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('dataProdNm') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('crtYmd') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('crtrYmd') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('instt_code') + '=' + encodeURIComponent(''); /* */
            queryParams += '&' + encodeURIComponent('instt_nm') + '=' + encodeURIComponent(''); /* */

            const url = apiEndPoint + queryParams;

            const response = await axios.get(url);
            console.log(response);
            const data = response.data;
    
            if (data && data.length > 0) {
                const food = data[0];
                console.log(`음식명: ${food.foodNm}`);
                console.log(`칼로리: ${food.enerc} kcal`);
                console.log(`탄수화물: ${food.chocdf} g`);
                console.log(`단백질: ${food.prot} g`);
                console.log(`지방: ${food.fatce} g`);
            } else {
                console.log('검색 결과가 없습니다.');
            }
        } catch (error) {
            console.error("API 호출 중 오류 발생", error);
            console.log("응답 데이터:", error); // 오류 발생 시 응답 데이터 출력
        }
    }

    app.get('/', (req, res) => {
        fetchFoodData();
        res.sendFile(path.join(__dirname, '../index.html'));
    });

    app.use(errorMiddleware);
};
