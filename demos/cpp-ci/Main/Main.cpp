
#include "../Utils/Test.h"

static int* create()
{
    return new int;
}

int main( int argc, char ** argv )
{
    int* p = 0;
    p = create();
    delete p;

    CTest test;
    // test.DoNothing();
    // test.Print1();
    // test.Print2();
    test.AllPrint();
}
