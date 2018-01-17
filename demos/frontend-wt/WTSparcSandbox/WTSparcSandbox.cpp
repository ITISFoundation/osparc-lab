#ifdef _WIN32
#ifdef _DEBUG
#pragma comment(lib, "wtd.lib")
#pragma comment(lib, "wthttpd.lib")
#pragma comment(lib, "wtdbod.lib")
#pragma comment(lib, "wtdbosqlite3d.lib")
#else
#pragma comment(lib, "wt.lib")
#pragma comment(lib, "wthttp.lib")
#pragma comment(lib, "wtdbo.lib")
#pragma comment(lib, "wtdbosqlite3.lib")
#endif
#endif
