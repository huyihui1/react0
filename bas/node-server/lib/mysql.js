export function asyncQuery(conn, sql, params) {
  return new Promise(function (resovle, reject) {
    conn.query(sql, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resovle(results);
      }
    });
  });
}