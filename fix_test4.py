import sys
f='backend/src/test/java/com/smartbus/alert/AlertIntegrationTest.java'
c=open(f).read()
c=c.replace('student.setActive(true);', 'student.setStatus("ACTIVE");')
c=c.replace('driver.setActive(true);', 'driver.setStatus("ACTIVE");')
open(f,'w').write(c)
