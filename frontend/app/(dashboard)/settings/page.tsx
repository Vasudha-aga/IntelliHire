"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Bell, Shield, Palette, Save } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader greeting="Settings" />

      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="font-heading text-2xl font-bold text-foreground mb-6">
          Account Settings
        </h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="profile" className="data-[state=active]:gradient-btn data-[state=active]:text-white">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:gradient-btn data-[state=active]:text-white">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:gradient-btn data-[state=active]:text-white">
              <Palette className="w-4 h-4 mr-2" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:gradient-btn data-[state=active]:text-white">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="glass rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">PS</span>
                </div>
                <div>
                  <h2 className="font-heading font-semibold text-foreground">Priya Sharma</h2>
                  <p className="text-sm text-muted-foreground">priya@example.com</p>
                  <Button variant="outline" size="sm" className="mt-2 border-border">
                    Change Photo
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Priya" className="bg-card border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Sharma" className="bg-card border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="priya@example.com" className="bg-card border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" defaultValue="+91 98765 43210" className="bg-card border-border" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  defaultValue="ML Engineer with 3+ years of experience"
                  className="bg-card border-border"
                />
              </div>

              <Button className="gradient-btn border-0 text-white">
                <Save className="mr-2 w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <div className="glass rounded-2xl p-6 space-y-6">
              <h2 className="font-heading font-semibold text-foreground">
                Notification Preferences
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Interview Reminders</p>
                    <p className="text-sm text-muted-foreground">Get reminded before practice sessions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Weekly Progress Report</p>
                    <p className="text-sm text-muted-foreground">Receive weekly summary of your progress</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Tips & Suggestions</p>
                    <p className="text-sm text-muted-foreground">Get AI-powered improvement tips</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-foreground">Marketing Emails</p>
                    <p className="text-sm text-muted-foreground">Receive news and promotional content</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Button className="gradient-btn border-0 text-white">
                <Save className="mr-2 w-4 h-4" />
                Save Preferences
              </Button>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <div className="glass rounded-2xl p-6 space-y-6">
              <h2 className="font-heading font-semibold text-foreground">
                App Preferences
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Default Interview Mode</Label>
                  <Select defaultValue="video">
                    <SelectTrigger className="bg-card border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="voice">Voice</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Preferred Language</Label>
                  <Select defaultValue="python">
                    <SelectTrigger className="bg-card border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default Difficulty</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger className="bg-card border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Time Zone</Label>
                  <Select defaultValue="ist">
                    <SelectTrigger className="bg-card border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ist">IST (UTC+5:30)</SelectItem>
                      <SelectItem value="pst">PST (UTC-8)</SelectItem>
                      <SelectItem value="est">EST (UTC-5)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Auto-save Answers</p>
                    <p className="text-sm text-muted-foreground">Automatically save your interview answers</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-foreground">Show Timer</p>
                    <p className="text-sm text-muted-foreground">Display countdown timer during interviews</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Button className="gradient-btn border-0 text-white">
                <Save className="mr-2 w-4 h-4" />
                Save Preferences
              </Button>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="glass rounded-2xl p-6 space-y-6">
              <h2 className="font-heading font-semibold text-foreground">
                Security Settings
              </h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                    className="bg-card border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    className="bg-card border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="bg-card border-border"
                  />
                </div>
              </div>

              <Button className="gradient-btn border-0 text-white">
                Update Password
              </Button>

              <div className="pt-6 border-t border-border">
                <h3 className="font-heading font-semibold text-foreground mb-4">
                  Two-Factor Authentication
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline" className="border-border">
                    Enable 2FA
                  </Button>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="font-heading font-semibold text-destructive mb-4">
                  Danger Zone
                </h3>
                <Button variant="destructive" className="bg-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground">
                  Delete Account
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
