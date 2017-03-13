import $ from 'jquery';
const conf = require('../../conf.js');

export class EventCountsByState {

  constructor() {
    this.tableName = "eventCountsByState";
  }

  getName(){
  	return this.tableName;
  }

  getSchema() {
    const schema = {
        id: this.tableName,
        alias: "Event Counts by State",
         columns: [{
          id: "event",
          dataType: tableau.dataTypeEnum.string
      }, {
          id: "state",
          dataType: tableau.dataTypeEnum.string
      }, {
          id: "count",
          dataType: tableau.dataTypeEnum.int
      }]
    };
    return schema;
  }

  getQuery(state) {
    const postData = {
      "window": "week",
      "matchExact": {
        "and": [
          {
            "visit": {
              "generated": {
                "geo": {
                  "region": state
                },
                "parsedUri": {
                  "hostname": conf.domain
                }
              }
            }
          }
        ]
      }
    };
  	return JSON.stringify(postData);
  }

  getStateCodes() {
    return ['al','ak','az','ar','ca','co','ct','de',
      'fl','ga','hi','id','il','in','ia','ks','ky','la',
      'me','md','ma','mi','mn','ms','mo','mt','ne','nv',
      'nh','nj','nm','ny','nc','nd','oh','ok','or','pa',
      'ri','sc','sd','tn','tx','ut','vt','va','wa','wv',
      'wi','wy'];

  }

  getDataInternal(i, table, cb){

    const codes = this.getStateCodes();

    $.post( `${conf.baseUrl}/events`, this.getQuery(codes[i]) )
        .then( (resp) => {
            table.appendRows( Object.entries(resp.result.counts).map( e => { 
              return { event : e[0], state: codes[i], count : e[1] };
            }));
            
        })
        .then( () => {

          if(i == codes.length-1){
            cb();
          } else {
            this.getDataInternal(i+1, table, cb);
          }

        });  
  }

  getData( table, cb ){

    this.getDataInternal(0, table, cb);

  }


}