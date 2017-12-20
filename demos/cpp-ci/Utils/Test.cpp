#include "Test.h"
#include "PrintHelloWorld.h"

void CTest::DoNothing() const
{
    // nothing
}


void CTest::Print1() const
{
    PrintHelloWorld();
}
void CTest::Print2() const
{
    PrintHelloWorld();
    PrintHelloWorld();
}

void CTest::Print3() const
{
    PrintHelloWorld();
}
void CTest::Print4() const
{
    PrintHelloWorld();
}
void CTest::Print5() const
{
    PrintHelloWorld();
}
void CTest::Print6() const
{
    PrintHelloWorld();
}
void CTest::Print7() const
{
    PrintHelloWorld();
}
void CTest::Print8() const
{
    PrintHelloWorld();
}
void CTest::Print9() const
{
    PrintHelloWorld();
}
void CTest::AllPrint() const
{
    Print1();
    Print2();
    Print3();
    Print4();
    Print5();
    Print6();
    Print7();
    Print8();
    Print9();
}

