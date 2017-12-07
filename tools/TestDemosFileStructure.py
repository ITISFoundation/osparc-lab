import os
import os.path
import sys
import logging

logging.getLogger().setLevel( logging.INFO )

class AllFine(object):
	def __init__(self):
		self.__ok = True
	def error( self, msg ):
		logging.error( msg )
		self.__ok = False
		
	def warning( self, msg ):
		logging.warning( msg )
		
	def okay( self ):
		print
		if self.__ok:
			logging.info( 'All tests passed' )
		else:
			logging.error( 'Some tests failed' )
		return self.__ok

		
def CheckMakefile( folder, all_fine ):
	logging.info( 'Checking makefile' )
	
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
		all_fine.warning( 'No "demo" target' )
	if not has_start:
		all_fine.warning( 'No "start" target' )
	if not has_stop:
		all_fine.warning( 'No "stop" target' )
		
def TestFileStructure():

	logging.info( 'Testing file structure in demos folder' )

	all_fine = AllFine()

	root_folder = 'demos'
	for sub_folder in os.listdir('demos'):
		folder = os.path.join( root_folder, sub_folder )
		if os.path.isdir( folder ):
			logging.info( 'Testing folder: ' + folder )
			
			# Makefile checks
			if not os.path.exists( os.path.join( folder, 'Makefile' ) ):
				all_fine.error( 'File "Makefile" does not exist (case sensitive!)' )
			else:
				CheckMakefile( folder, all_fine )
			
			# Readme check
			if not os.path.exists( os.path.join( folder, 'README.md' ) ):
				all_fine.error( 'File "README.md" does not exist (case sensitive!)' )
			else:
				with open( os.path.join( folder, 'README.md' ) ) as f:
					if 0 == len( f.readlines() ):
						all_fine.error( 'Readme file seems empty' )
			
	return all_fine.okay()

if __name__=='__main__':
	if TestFileStructure():
		sys.exit(0)
	else:
		sys.exit(1)
