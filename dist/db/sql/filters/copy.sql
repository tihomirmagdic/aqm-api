insert into airq.filters
  (${values:name})
select ${select:raw}
from airq.filters
where
  (${where:name}) = (${where:csv})
${returning:raw}