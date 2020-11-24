const _ = require( "lodash" );
const ElasticMapper = require( "elasticmaps" );
const transform = require( "../../../../../joi_to_openapi_parameter" );
const observationsSearchSchema = require( "../../../../../schema/request/observations_search" );
const { tilePathParams } = require( "../../../../../common_parameters" );

const inheritdObsSearchParams = _.filter(
  observationsSearchSchema._inner.children, p => !_.includes( ["fields"], p.key )
);
const transformedObsSearchParams = _.map( inheritdObsSearchParams, p => (
  transform( p.schema.label( p.key ) )
) );

module.exports = sendWrapper => {
  async function GET( req, res ) {
    req.params.style = "heatmap";
    req.params.format = "png";
    ElasticMapper.route( req, res, ( err, data ) => {
      sendWrapper( req, res, err, data, "image/png" );
    } );
  }

  GET.apiDoc = {
    tags: ["Observation Tiles"],
    summary: "Grid Tiles",
    security: [{
      userJwtOptional: []
    }],
    parameters: tilePathParams.concat( transformedObsSearchParams ),
    responses: {
      200: {
        description: "Returns heatmap tiles.",
        content: {
          "image/png": {
            schema: {
              type: "string",
              format: "binary"
            }
          }
        }
      }
    }
  };

  return {
    GET
  };
};
