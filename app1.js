'use strict';
//Node.js に用意されたモジュールを呼び出し
const fs = require('fs');
const readline = require('readline');

// popu-pref.csv ファイルから、ファイルを読み込みを行う Stream（ストリーム）を生成
const rs = fs.createReadStream('./popu-pref.csv');
//readline オブジェクトの input として設定し rl オブジェクトを作成
const rl = readline.createInterface({ input: rs, output: {} });
//key: 都道府県 value: 集計データのオブジェクト
const prefectureDataMap = new Map();

//rl オブジェクトで line というイベントが発生したら この無名関数を呼ぶ
rl.on('line', lineString =>{
    const columns = lineString.split(','); 
    const year = parseInt(columns[0]);//変数を文字列から数値へ変換
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if (year === 2010 || year === 2015){
        console.log(year);
        console.log(prefecture);
        console.log(popu);
    }
});
