# PC: disabled import-error because in this configuration, requirements are not installed!
# PC: disabled fixme to allow TODO messages

echo 'Pylint report legend -----------------------------------------------'
echo '[R]efactor for a “good practice” metric violation'
echo '[C]onvention for coding standard violation'
echo '[W]arning for stylistic problems, or minor programming issues'
echo '[E]rror for important programming issues (i.e. most probably bug)'
echo '[F]atal for errors which prevented further processing'
echo '--------------------------------------------------------------------'

find $1 -iname "*.py" | xargs pylint --rcfile=.pylintrc --disable=import-error --disable=fixme
