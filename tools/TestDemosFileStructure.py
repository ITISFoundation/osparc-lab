import os
import os.path
import sys

class AllFine:
	def __init__(self):
		self.__ok = True
	def Error( self, msg ):
		print '[ERROR]: ' + msg
		self.__ok = False
		
	def Warning( self, msg ):
		print '[WARNING]: ' + msg
		
	def Okay( self ):
		print
		if self.__ok:
			print 'All tests passed'
		else:
			self.Error( 'Some tests failed' )
		return self.__ok

		
def CheckMakefile( folder, all_fine ):
	print 'Checking makefile'
	
	# not sure, if these tests make sense ... feel free to change and/or extend
	has_demo = False
	has_start = False
	has_stop = False
	with open( os.path.join( folder, 'Makefile' ) ) as f:
		for line in f:
			if line.startswith( 'demo:' ):
				has_demo = True
			if line.startswith( 'start:' ):
				has_start = True
			if line.startswith( 'stop:' ):
				has_stop = True
				
	if not has_demo:
		all_fine.Warning( 'No "demo" target' )
	if not has_start:
		all_fine.Warning( 'No "start" target' )
	if not has_stop:
		all_fine.Warning( 'No "stop" target' )
		
def TestFileStructure():

	print 'Testing file structure in demos folder'

	all_fine = AllFine()

	root_folder = 'demos'
	for sub_folder in os.listdir('demos'):
		folder = os.path.join( root_folder, sub_folder )
		if os.path.isdir( folder ):
			print 'Testing folder: ' + folder
			
			# Makefile checks
			if not os.path.exists( os.path.join( folder, 'Makefile' ) ):
				all_fine.Error( 'File "Makefile" does not exist (case sensitive!)' )
			else:
				CheckMakefile( folder, all_fine )
			
			# Readme check
			if not os.path.exists( os.path.join( folder, 'README.md' ) ):
				all_fine.Error( 'File "README.md" does not exist (case sensitive!)' )
			else:
				if 0 == len( file( os.path.join( folder, 'README.md' ) ).readlines() ):
					all_fine.Error( 'Readme file seems empty' )
			
	return all_fine.Okay()

if __name__=='__main__':
	if TestFileStructure():
		sys.exit(0)
	else:
		sys.exit(1)
		