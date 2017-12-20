FROM ubuntu:16.04

WORKDIR /usr/local/bin/itis_foundation/demo_cpp_ci

COPY . .

CMD ["./CppCiTest"]
