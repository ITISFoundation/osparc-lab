#include <iostream>
#include <chrono>
#include <thread>
#include <cstdlib>
#include <math.h>
#include <string>
#include <fstream>


int main(int argc, char* argv[])
{
  int N = 100;
  float xmin=0.f;
  float xmax=1.f;
  std::string filename = "output.dat";

  if (argc>1)
  { 
    xmin = std::atof(argv[1]);
  }
  if (argc>2)
  {
    xmax = std::atof(argv[2]);
  }
  if (argc>3)
  { 
    N = std::atoi(argv[3]);
  }
  if (argc>4)
  {
    filename = std::string(argv[4]);
  }
  std::cout << "Calculating sin(x) in [" << xmin << "," << xmax << "] for " << N << " values" << std::endl;
  float dx = (xmax-xmin)/static_cast<float>(N); 
 
  std::ofstream output;
  output.open(filename);
  for(int i=0; i<=N; i++) 
  {
    float x = xmin + static_cast<float>(i)*dx;
    float y = sin(x);
    float p = static_cast<float>(i) / static_cast<float>(N) * 100.f;
    output << x << "\t" << y << std::endl;
    std::cout << "Progress: " << p << " %" << std::endl;
    std::this_thread::sleep_for(std::chrono::milliseconds(100));
  }
  output.close();

  return 0;
}
