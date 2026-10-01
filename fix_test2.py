import sys
f='backend/src/test/java/com/smartbus/alert/AlertIntegrationTest.java'
c=open(f).read()
c=c.replace('college.setName("Test College");', 'college.setName("Test College");\n        college.setCode("TEST");\n        college.setTimezone("UTC");')
open(f,'w').write(c)
