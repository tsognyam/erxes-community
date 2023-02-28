import { mapping, types, Client } from 'cassandra-driver';
const Mapper = mapping.Mapper;
const UnderscoreCqlToCamelCaseMappings =
  mapping.UnderscoreCqlToCamelCaseMappings;
const Uuid = types.Uuid;
// const authProvider = new cassandra.auth.PlainTextAuthProvider(
// process.env.CASSANDRA_USER,
// process.env.CASSANDRA_PASS,
// );

// const educationMapper = mapper.forModel('education');

let cassandra_host: any = process.env.CASS_NODE;
if (cassandra_host.length != 0) {
  cassandra_host = cassandra_host.split(', ');
}
const client = new Client({
  contactPoints: cassandra_host,
  localDataCenter: process.env.CASS_DC
  // authProvider,
  // keyspace: process.env.CASS_KEYSPACE,
});

client
  .connect()
  .then(function() {
    console.log('Connected to Cassandra');
    const queries = [
      `CREATE KEYSPACE IF NOT EXISTS trading
       WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1' }`,
      'USE trading',
      `CREATE TABLE IF NOT EXISTS mse_orderbook (id uuid, type int, price double, volume int,
        regdate timestamp, symbol text,
        PRIMARY KEY (symbol, type, price, volume))`,
      `CREATE TABLE IF NOT EXISTS mse_last (id uuid, type int, price double, volume int,
            regdate timestamp, symbol text,
            PRIMARY KEY (symbol, regdate, price, volume))`,
      `CREATE TABLE IF NOT EXISTS mse_market (symbol text, volume int, openprice double, maxprice double, minprice double, closeprice double, prevprice double, diffprice double, buyvol int, buyprice double, sellprice double, sellvol int, txndate timestamp, regdate timeuuid, lastprice double, lastvol int, totalamount double, trades int, vwap double,
                PRIMARY KEY (symbol, regdate))
                WITH CLUSTERING ORDER BY (regdate DESC)`
    ];
    let p = Promise.resolve();
    // Create the schema executing the queries serially
    // queries.forEach(query => p = p.then(() => client.execute(query)));
    return p;
  })
  .catch(function(err) {
    console.error('There was an error on cassandra.', err);
    return client.shutdown().then(() => {
      throw err;
    });
  });

export default client;
