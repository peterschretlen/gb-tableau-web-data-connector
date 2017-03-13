import $ from 'jquery';
const conf = require('../../conf.js');

export class TopSearchTerms {

  constructor() {
    this.tableName = "topTerms";
  }

  getName(){
  	return this.tableName;
  }

  getSchema() {
    const schema = {
  		id: this.tableName,
  		alias: "Search Term Frequency",
  		columns: [{
  		    id: "query",
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
  	      },
  	      {
  	      	"search": {
  	      	  "pageInfo": {  
  	      	      "recordStart": {
  	      	      	lte: 1 // first page of results
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

		$.post( `${conf.baseUrl}/recommendations/searches/_getPopular`, 
				this.getQuery() ).then( (resp) => {
	        table.appendRows(resp.result);
	        cb();
	    });
	  }

}