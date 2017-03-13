import $ from 'jquery';
const conf = require('../../conf.js');

export class EventCounts {

  constructor() {
    this.tableName = "eventCounts";
  }

  getName(){
  	return this.tableName;
  }

  getSchema() {
    const schema = {
        id: this.tableName,
        alias: "Event Counts",
         columns: [{
          id: "event",
          dataType: tableau.dataTypeEnum.string
      }, {
          id: "count",
          dataType: tableau.dataTypeEnum.int
      }]
    };
    return schema;
  }

  getQuery() {
    const postData = {
      "window": "week",
      "matchExact": {
        "and": [
          {
            "visit": {
              "generated": {
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

  getData( table, cb ){

    $.post( `${conf.baseUrl}/events`, this.getQuery() )
        .then( (resp) => {
            table.appendRows( Object.entries(resp.result.counts).map( e => { 
              return { event : e[0], count : e[1] };
            }));
            cb();
        });
  }


}