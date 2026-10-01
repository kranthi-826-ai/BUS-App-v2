import sys
f='backend/src/test/java/com/smartbus/attendance/AttendanceIntegrationTest.java'
c=open(f).read()
c=c.replace('testTrip.setBusId(testBus.getId());', 'testTrip.setBus(testBus);')
c=c.replace('testTrip.setRouteId(testRoute.getId());', 'testTrip.setRoute(testRoute);')
c=c.replace('testTrip.setInchargeId(driver.getId());', 'testTrip.setIncharge(driver);')
c=c.replace('testTrip.setStatus("ACTIVE");', 'testTrip.setStatus(com.smartbus.trip.entity.TripStatus.ACTIVE);')
open(f,'w').write(c)
