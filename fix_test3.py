import sys
f='backend/src/test/java/com/smartbus/alert/AlertIntegrationTest.java'
c=open(f).read()
c=c.replace('college.setTimezone("UTC");', 'college.setTimezone("UTC");\n        college.setCreatedAt(Instant.now());\n        college.setUpdatedAt(Instant.now());')
c=c.replace('student.setActive(true);', 'student.setActive(true);\n        student.setCreatedAt(Instant.now());\n        student.setUpdatedAt(Instant.now());')
c=c.replace('driver.setActive(true);', 'driver.setActive(true);\n        driver.setCreatedAt(Instant.now());\n        driver.setUpdatedAt(Instant.now());')
c=c.replace('bus.setCapacity(50);', 'bus.setCapacity(50);\n        bus.setCreatedAt(Instant.now());\n        bus.setUpdatedAt(Instant.now());')
open(f,'w').write(c)
