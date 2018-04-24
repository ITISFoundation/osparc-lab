extern "C" {
  #include "tinyexpr.h"
}

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
  double xmin=0.f;
  double xmax=1.f;
  std::string filename = "output.dat";
  std::string func = "sin(x)";
  double x;
  te_variable vars[] = {{"x", &x}};
  int err;

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
     func = std::string(argv[4]);
  } 
  if (argc>5)
  {
    filename = std::string(argv[5]);
  }

  std::cout <<func <<std::endl;
  te_expr* expr = te_compile(func.c_str(), vars, 1, &err);
  if (!expr)
  {
    std::cout << "Parse error at " << err << std::endl;
    return 1;
  }

  std::cout << "Calculating " << func << " in [" << xmin << "," << xmax << "] for " << N << " values" << std::endl;
  double dx = (xmax-xmin)/static_cast<double>(N); 
 
  std::ofstream output;
  output.open(filename);
  for(int i=0; i<=N; i++) 
  {
    x = xmin + static_cast<double>(i)*dx;
    double y = te_eval(expr);
    double p = static_cast<double>(i) / static_cast<double>(N) * 100.f;
    output << x << "\t" << y << std::endl;
    std::cout << "f(x=" << x << ") = " << y << std::endl;
    std::cout << "[Progress] " << p << " %" << std::endl;
    std::this_thread::sleep_for(std::chrono::milliseconds(10));
  }
  output.close();

  return 0;
}
