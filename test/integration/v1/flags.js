const { expect } = require( "chai" );
const request = require( "supertest" );
const jwt = require( "jsonwebtoken" );
const nock = require( "nock" );
const fs = require( "fs" );
const config = require( "../../../config.js" );
const iNaturalistAPI = require( "../../../lib/inaturalist_api" );

const app = iNaturalistAPI.server( );

const fixtures = JSON.parse( fs.readFileSync( "schema/fixtures.js" ) );

describe( "Flags", ( ) => {
  const currentUser = fixtures.elasticsearch.users.user[0];
  const token = jwt.sign( { user_id: currentUser.id }, config.jwtSecret || "secret",
    { algorithm: "HS512" } );

  describe( "create", ( ) => {
    it( "should succeed", done => {
      nock( "http://localhost:3000" )
        .post( "/flags" )
        .reply( 200, { id: 1 } );
      request( app ).post( "/v1/flags" ).set( "Authorization", token )
        .expect( res => {
          expect( res.body.id ).to.eq( 1 );
        } )
        .expect( "Content-Type", /json/ )
        .expect( 200, done );
    } );
  } );

  describe( "update", ( ) => {
    it( "should succeed", done => {
      nock( "http://localhost:3000" )
        .put( "/flags/1" )
        .reply( 200, { id: 1 } );
      request( app ).put( "/v1/flags/1" ).set( "Authorization", token )
        .expect( res => {
          expect( res.body.id ).to.eq( 1 );
        } )
        .expect( "Content-Type", /json/ )
        .expect( 200, done );
    } );
  } );

  describe( "delete", ( ) => {
    it( "should succeed", done => {
      nock( "http://localhost:3000" )
        .delete( "/flags/1" )
        .reply( 200, {} );
      request( app ).delete( "/v1/flags/1" ).set( "Authorization", token )
        .expect( "Content-Type", /json/ )
        .expect( 200, done );
    } );
  } );
} );
