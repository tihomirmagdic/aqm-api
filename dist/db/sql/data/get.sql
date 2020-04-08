select
  ${fields:raw}
from
  airq.data${addTables:raw}
where
  ${measured:raw} and
  ${locations:raw}
${order:raw}
offset ${offset}
limit ${limit}