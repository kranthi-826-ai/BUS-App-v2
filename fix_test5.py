import sys
f='backend/src/test/java/com/smartbus/alert/AlertIntegrationTest.java'
c=open(f).read()
c=c.replace('student.setRole("STUDENT");', 'student.setRole("STUDENT");\n        student.setStatus("ACTIVE");')
c=c.replace('driver.setRole("DRIVER");', 'driver.setRole("DRIVER");\n        driver.setStatus("ACTIVE");')
open(f,'w').write(c)
