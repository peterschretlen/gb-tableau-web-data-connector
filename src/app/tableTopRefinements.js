import $ from 'jquery';
const conf = require('../../conf.js');
const faker = require('faker');

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
            this.setValue(r, rows, true);
          });

	        table.appendRows(rows);
	        cb();
	    });
	  }

  setValue(ref, rows, fake ){

    //replace category digits with prefix
    let name = ['1','2','3'].find( v => v === ref.name ) ? `category_${ref.name}` :  ref.name;

    //replace subvariant prefix
    name = name.replace("variants.subvariant.","");

    if(fake){
      if(ref.values) ref.values.forEach( v => rows.push({ name: name, value: faker.fake("{{random.word}}"), count: v.count }) );
      if(ref.highs) ref.highs.forEach( v => rows.push({ name: name, value: `high | ${faker.fake('{{commerce.price}}')}`, count: v.count }) );
      if(ref.lows) ref.lows.forEach( v => rows.push({ name: name, value: `low | ${faker.fake('{{commerce.price}}')}`, count: v.count }) );
    } else {
      if(ref.values) ref.values.forEach( v => rows.push({ name: name, value: v.value, count: v.count }) );
      if(ref.highs) ref.highs.forEach( v => rows.push({ name: name, value: `high | ${v.high}`, count: v.count }) );
      if(ref.lows) ref.lows.forEach( v => rows.push({ name: name, value: `low | ${v.low}`, count: v.count }) );
    }

  }

}