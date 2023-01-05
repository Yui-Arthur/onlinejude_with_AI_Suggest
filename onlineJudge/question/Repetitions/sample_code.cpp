#include <bits/stdc++.h>
using namespace std;

int main() {
    string s;
    cin>>s;

    int cc=1,ans=1;

    for(int i=1;i<s.size();i++)
    {   
        if(s[i]==s[i-1])
            cc++;
        else
            cc=1;

        ans = max(ans,cc);
    }

    cout<<ans<<endl;


}