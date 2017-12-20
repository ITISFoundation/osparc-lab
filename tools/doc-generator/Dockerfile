FROM python:alpine3.6

WORKDIR /usr/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

#COPY . .

VOLUME /usr/app
EXPOSE 8000

CMD ["python", "-m", "mkdocs", "serve", "--dev-addr", "0.0.0.0:8000" ]

# Usage
# cd osparc-lab
# docker build -t doc-generator tools/doc-generator
# docker run -it -v $(pwd):/usr/src/app -p 8000:8000 doc-generator
#

# http://www.mkdocs.org/
#  MkDocs - Project documentation with Markdown.

#Options:
#  -V, --version  Show the version and exit.
#  -q, --quiet    Silence warnings
#  -v, --verbose  Enable verbose output
#  -h, --help     Show this message and exit.

#Commands:
#  build      Build the MkDocs documentation
#  gh-deploy  Deploy your documentation to GitHub Pages
#  new        Create a new MkDocs project
#  serve      Run the builtin development server
