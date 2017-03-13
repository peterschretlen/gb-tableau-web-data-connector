import $ from 'jquery';
import { TopSearchTerms } from './tableTopSearchTerms';
import { TopRefinements } from './tableTopRefinements';
import { EventCounts } from './tableEventCounts';
import { EventCountsByState } from './tableEventCountsByState';

const init = () => {

    // Create the connector object
    const myConnector = tableau.makeConnector();

    const tables = [
    		new TopSearchTerms(), 
    		new TopRefinements(), 
    		new EventCounts(),
    		new EventCountsByState()
    	];

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        schemaCallback( tables.map( t => t.getSchema() ));
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {

    	const tableDef = tables.find( t => t.getName() === table.tableInfo.id );
    	
    	if(!tableDef) doneCallback();

    	tableDef.getData( table, doneCallback );

    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "GroupBy"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
};

init();
