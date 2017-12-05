import os
import os.path
import sys

class AllFine:
	def __init__(self):
		self.__ok = True
	def Error( self, msg ):
		print '[ERROR]: ' + msg
		self.__ok = False
		
	def Okay( self ):
		if self.__ok:
			print 'All tests passed'
		else:
			self.Error( 'Some tests failed' )
		return self.__ok

def TestFileStructure():

	print 'Testing file structure in demos folder'

	all_fine = AllFine()

	root_folder = 'demos'
	for sub_folder in os.listdir('demos'):
		folder = os.path.join( root_folder, sub_folder )
		if os.path.isdir( folder ):
			print 'Testing folder: ' + folder
			if not os.path.exists( os.path.join( folder, 'Makefile' ) ):
				all_fine.Error( 'File "Makefile" does not exist (case sensitive?)' )
			if not os.path.exists( os.path.join( folder, 'README.md' ) ):
				all_fine.Error( 'File "README.md" does not exist (case sensitive?)' )
			
	return all_fine.Okay()

if __name__=='__main__':
	if TestFileStructure():
		sys.exit(0)
	else:
		sys.exit(1)
		