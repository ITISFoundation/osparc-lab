import urllib
import sys


def check_menu(key_word="Risotto", day=0, verbose=False):
    if day == '42':
        return 1
    run_for_lunch = 0
    try:
        url = "https://gastro.lunchgate.ch/widget.php?type=standardpremium&id=652&day=" + \
            str(day)
        html_doc = urllib.urlopen(url).read().lower()

        try:
            from bs4 import BeautifulSoup
            soup = BeautifulSoup(html_doc, "html.parser")
            table = soup.find("table", attrs={"class": "dailymenus"})
            all_cells = [td.get_text()
                         for td in table.find("tr").find_all("td")]
            if key_word.lower() in all_cells[0]:
                run_for_lunch = 1
            if verbose:
                if run_for_lunch:
                    print 'Lucky you!'
                else:
                    print 'Nope :('
                print all_cells[0].capitalize()

        except ImportError:
            # Take only first choice into account
            portare = html_doc.find('class="price"')
            if html_doc.find(key_word.lower()) > -1 and html_doc.find(key_word.lower()) < portare:
                run_for_lunch = 1
            if verbose:
                if run_for_lunch:
                    print 'Lucky you!'
                else:
                    print 'Nope :('

    except ValueError:
        run_for_lunch = 0

    return run_for_lunch

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print 'False'
    else:
        oggi = check_menu(key_word=sys.argv[
                          1], day=sys.argv[2], verbose=False)
        print oggi
