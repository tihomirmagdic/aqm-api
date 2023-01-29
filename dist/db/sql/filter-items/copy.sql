insert into airq.filteritems
  (${values:name})
select ${select:raw}
from airq.filteritems
where
  (${where:name}) = (${where:csv})
${returning:raw}