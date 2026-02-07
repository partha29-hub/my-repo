import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield, Star, MessageSquare } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { useMember } from '@/integrations';
import { WatchedAsteroids, CommunityDiscussions } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { format } from 'date-fns';
import { Image } from '@/components/ui/image';

export default function ProfilePage() {
  const { member } = useMember();
  const [watchedCount, setWatchedCount] = useState(0);
  const [discussionCount, setDiscussionCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserStats();
  }, [member]);

  const loadUserStats = async () => {
    setIsLoading(true);
    
    const watchedResult = await BaseCrudService.getAll<WatchedAsteroids>('watchedasteroids');
    const userWatched = watchedResult.items.filter(item => item.userId === member?._id);
    setWatchedCount(userWatched.length);

    const discussionsResult = await BaseCrudService.getAll<CommunityDiscussions>('communitydiscussions');
    const userDiscussions = discussionsResult.items.filter(item => item.authorId === member?._id);
    setDiscussionCount(userDiscussions.length);

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16 px-8 md:px-16">
          <div className="max-w-[100rem] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row items-start md:items-center gap-8"
            >
              <div className="w-24 h-24 rounded-full bg-accentcyan text-primary flex items-center justify-center flex-shrink-0">
                {member?.profile?.photo?.url ? (
                  <Image src={member.profile.photo.url} alt={member.profile.nickname || 'User'} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-12 h-12" />
                )}
              </div>
              
              <div>
                <h1 className="font-heading text-5xl md:text-6xl mb-2">
                  {member?.profile?.nickname || member?.contact?.firstName || 'Space Explorer'}
                </h1>
                <p className="font-paragraph text-lg opacity-80">
                  Member since {member?._createdDate ? format(new Date(member._createdDate), 'MMMM yyyy') : 'recently'}
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-secondary py-16 px-8 md:px-16">
          <div className="max-w-[100rem] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-4xl text-secondary-foreground mb-8">
                Activity Overview
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-primary text-primary-foreground p-8 rounded-lg">
                  <Star className="w-12 h-12 text-accentcyan mb-4" />
                  <h3 className="font-heading text-5xl mb-2">{watchedCount}</h3>
                  <p className="font-paragraph text-lg opacity-80">
                    Watched Asteroids
                  </p>
                </div>

                <div className="bg-primary text-primary-foreground p-8 rounded-lg">
                  <MessageSquare className="w-12 h-12 text-accentcyan mb-4" />
                  <h3 className="font-heading text-5xl mb-2">{discussionCount}</h3>
                  <p className="font-paragraph text-lg opacity-80">
                    Discussion Posts
                  </p>
                </div>

                <div className="bg-primary text-primary-foreground p-8 rounded-lg">
                  <Shield className="w-12 h-12 text-accentcyan mb-4" />
                  <h3 className="font-heading text-5xl mb-2">
                    {member?.status === 'APPROVED' ? 'Active' : 'Pending'}
                  </h3>
                  <p className="font-paragraph text-lg opacity-80">
                    Account Status
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Profile Details */}
        <section className="bg-primary text-primary-foreground py-16 px-8 md:px-16">
          <div className="max-w-[100rem] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-4xl mb-8">
                Profile Information
              </h2>
              
              <div className="bg-secondary text-secondary-foreground p-8 rounded-lg">
                <div className="space-y-6">
                  <div className="flex items-start gap-4 pb-6 border-b border-secondary-foreground border-opacity-20">
                    <User className="w-6 h-6 text-accentcyan flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-heading text-xl mb-2">Display Name</h3>
                      <p className="font-paragraph text-lg">
                        {member?.profile?.nickname || member?.contact?.firstName || 'Not set'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pb-6 border-b border-secondary-foreground border-opacity-20">
                    <Mail className="w-6 h-6 text-accentcyan flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-heading text-xl mb-2">Email Address</h3>
                      <p className="font-paragraph text-lg">
                        {member?.loginEmail || 'Not available'}
                      </p>
                      {member?.loginEmailVerified && (
                        <p className="font-paragraph text-sm text-accentcyan mt-1">
                          ✓ Verified
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pb-6 border-b border-secondary-foreground border-opacity-20">
                    <Calendar className="w-6 h-6 text-accentcyan flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-heading text-xl mb-2">Member Since</h3>
                      <p className="font-paragraph text-lg">
                        {member?._createdDate 
                          ? format(new Date(member._createdDate), 'MMMM dd, yyyy')
                          : 'Recently joined'}
                      </p>
                    </div>
                  </div>

                  {member?.lastLoginDate && (
                    <div className="flex items-start gap-4">
                      <Calendar className="w-6 h-6 text-accentcyan flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-heading text-xl mb-2">Last Login</h3>
                        <p className="font-paragraph text-lg">
                          {format(new Date(member.lastLoginDate), 'MMMM dd, yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-secondary py-16 px-8 md:px-16">
          <div className="max-w-[100rem] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-primary text-primary-foreground p-10 rounded-lg"
            >
              <h2 className="font-heading text-3xl mb-6">About Your Account</h2>
              <p className="font-paragraph text-lg leading-relaxed opacity-90 mb-6">
                Your Cosmic Watch account gives you access to personalized asteroid tracking, 
                community discussions, and custom alert notifications for Near-Earth Objects.
              </p>
              <p className="font-paragraph text-base leading-relaxed opacity-80">
                Continue exploring the cosmos by adding asteroids to your watchlist and 
                engaging with the global community of space enthusiasts and researchers.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
