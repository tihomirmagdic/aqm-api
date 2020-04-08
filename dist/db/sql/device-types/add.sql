insert into airq.devicetypes
  (${values:name})
  values(${values:csv})
	${returning:raw}