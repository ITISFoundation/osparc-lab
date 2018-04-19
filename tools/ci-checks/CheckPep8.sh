# PC: disabled import-error because in this configuration, requirements are not installed!
# PC: disabled fixme to allow TODO messages

#'Pylint report legend -----------------------------------------------'
#'[R]efactor for a “good practice” metric violation'
#'[C]onvention for coding standard violation'
#'[W]arning for stylistic problems, or minor programming issues'
#'[E]rror for important programming issues (i.e. most probably bug)'
#'[F]atal for errors which prevented further processing'
#'--------------------------------------------------------------------'

find $1 -iname "*.py" -not -path "*/gen-py/*" | xargs pylint --rcfile=.pylintrc --disable=import-error --disable=fixme
