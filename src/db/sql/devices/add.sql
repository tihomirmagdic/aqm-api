insert into airq.devices
  (${values:name})
  values(${values:csv})
	${returning:raw}