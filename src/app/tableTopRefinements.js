import $ from 'jquery';
const conf = require('../../conf.js');

export class TopRefinements {

  constructor() {
    this.tableName = "topRefinements";
  }

  getName(){
  	return this.tableName;
  }

  getSchema() {
    const schema = {
  		id: this.tableName,
  		alias: "Refinement Values",
  		columns: [{
  		    id: "name",
  		    dataType: tableau.dataTypeEnum.string
      }, {
          id: "value",
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
  	  "size": 100,
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

		$.post( `${conf.baseUrl}/recommendations/refinements/_getPopular`, 

        this.getQuery() ).then( (resp) => {
          const rows = [];

          resp.result.forEach( r => {

            if(r.values) r.values.forEach( v => rows.push({ name: r.name, value: v.value, count: v.count }) );
            if(r.highs) r.highs.forEach( v => rows.push({ name: r.name, value: `high | ${v.high}`, count: v.count }) );
            if(r.lows) r.lows.forEach( v => rows.push({ name: r.name, value: `low | ${v.low}`, count: v.count }) );

          });

	        table.appendRows(rows);
	        cb();
	    });
	  }

}