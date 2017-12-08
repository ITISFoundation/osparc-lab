#include <iostream>
#include <chrono>
#include <thread>

int main(int argc, char* argv[])
{
  int N = 1000;
  if (argc>1)
  { 
    N = std::atoi(argv[1]);
  }

  for(int i=0; i<N; i++) 
  {
    std::cout << i << std::endl;
    std::this_thread::sleep_for(std::chrono::milliseconds(100));
  }

  return 0;
}
