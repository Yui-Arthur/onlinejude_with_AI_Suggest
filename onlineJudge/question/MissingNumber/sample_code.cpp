#include <bits/stdc++.h>
using namespace std;

int main() {
    long long n;
    cin >> n;
    int a[n+1]={0};
    for(int i=0;i<n-1;i++)
    {
        int tmp;
        cin>>tmp;

        a[tmp] = 1;
    }

    for (int i=1;i<=n;i++)
    {
        if(a[i]==0)
            cout<<i;
    }

    
}