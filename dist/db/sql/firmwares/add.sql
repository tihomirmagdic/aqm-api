insert into airq.firmwares
  (${values:name})
  values(${values:csv})
	${returning:raw}